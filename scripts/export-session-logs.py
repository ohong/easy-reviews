#!/usr/bin/env python3
"""Export Claude Code session JSONL logs into readable Markdown files.

Reads every *.jsonl session transcript for the easy-reviews project from
~/.claude/projects/<sanitized-cwd>/ and writes one Markdown file per session
into the output directory.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

PROJECT_DIR = os.path.expanduser(
    "~/.claude/projects/-Users-ohong-dev-easy-reviews"
)
OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "session-logs"
)

MAX_RESULT_CHARS = 4000  # truncate very long tool outputs


def fmt_ts(ts):
    if not ts:
        return ""
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    except Exception:
        return ts


def slugify(text, maxlen=50):
    text = re.sub(r"<[^>]+>", "", text or "")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:maxlen] or "session"


def fence(text, lang=""):
    text = text if isinstance(text, str) else json.dumps(text, indent=2)
    if len(text) > MAX_RESULT_CHARS:
        text = text[:MAX_RESULT_CHARS] + f"\n... [truncated, {len(text)} chars total]"
    # avoid breaking the code fence
    bt = "```"
    while bt in text:
        bt += "`"
    return f"{bt}{lang}\n{text}\n{bt}"


def result_to_str(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for b in content:
            if isinstance(b, dict):
                if b.get("type") == "text":
                    parts.append(b.get("text", ""))
                elif b.get("type") == "image":
                    parts.append("[image]")
                else:
                    parts.append(json.dumps(b))
            else:
                parts.append(str(b))
        return "\n".join(parts)
    return json.dumps(content)


def load(path):
    records = []
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        try:
            records.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return records


def session_meta(records):
    title = None
    first_prompt = None
    start = end = None
    version = branch = None
    for r in records:
        t = r.get("type")
        if t == "ai-title" and r.get("title"):
            title = r["title"]
        if r.get("timestamp"):
            start = start or r["timestamp"]
            end = r["timestamp"]
        version = version or r.get("version")
        branch = branch or r.get("gitBranch")
        if t == "user" and first_prompt is None:
            c = r.get("message", {}).get("content")
            if isinstance(c, str) and not c.startswith("<"):
                first_prompt = c
    return {
        "title": title,
        "first_prompt": first_prompt,
        "start": start,
        "end": end,
        "version": version,
        "branch": branch,
    }


def render(records, session_id):
    meta = session_meta(records)
    out = []
    heading = meta["title"] or (meta["first_prompt"] or session_id)[:80]
    out.append(f"# Session: {heading}\n")
    out.append(f"- **Session ID:** `{session_id}`")
    out.append(f"- **Started:** {fmt_ts(meta['start'])}")
    out.append(f"- **Ended:** {fmt_ts(meta['end'])}")
    if meta["version"]:
        out.append(f"- **Claude Code version:** {meta['version']}")
    if meta["branch"]:
        out.append(f"- **Git branch:** {meta['branch']}")
    out.append("\n---\n")

    for r in records:
        t = r.get("type")
        if t not in ("user", "assistant", "system"):
            continue
        ts = fmt_ts(r.get("timestamp"))

        if t == "system":
            txt = r.get("content") or r.get("message", "")
            if isinstance(txt, str) and txt.strip():
                out.append(f"> _system ({ts}): {txt.strip()}_\n")
            continue

        msg = r.get("message", {})
        content = msg.get("content")
        role = msg.get("role", t)

        if t == "user":
            # skip tool_result-only echoes? keep them under the assistant flow
            if isinstance(content, str):
                if content.startswith("<local-command-caveat>"):
                    continue
                out.append(f"## 🧑 User · {ts}\n")
                out.append(content.strip() + "\n")
            elif isinstance(content, list):
                tool_results = [b for b in content if isinstance(b, dict)
                                and b.get("type") == "tool_result"]
                texts = [b for b in content if isinstance(b, dict)
                         and b.get("type") == "text"]
                for b in texts:
                    out.append(f"## 🧑 User · {ts}\n")
                    out.append((b.get("text") or "").strip() + "\n")
                for b in tool_results:
                    err = str(b.get("is_error")) == "True"
                    label = "⚠️ Tool Result (error)" if err else "↩️ Tool Result"
                    body = result_to_str(b.get("content"))
                    out.append(f"<details><summary>{label}</summary>\n")
                    out.append(fence(body) + "\n")
                    out.append("</details>\n")
            continue

        # assistant
        if isinstance(content, list):
            for b in content:
                if not isinstance(b, dict):
                    continue
                bt = b.get("type")
                if bt == "thinking":
                    think = (b.get("thinking") or "").strip()
                    if think:
                        out.append("<details><summary>💭 Thinking</summary>\n")
                        out.append(fence(think) + "\n")
                        out.append("</details>\n")
                elif bt == "text":
                    txt = (b.get("text") or "").strip()
                    if txt:
                        out.append(f"## 🤖 Assistant · {ts}\n")
                        out.append(txt + "\n")
                elif bt == "tool_use":
                    name = b.get("name", "tool")
                    inp = b.get("input", {})
                    out.append(f"**🔧 Tool call: `{name}`**\n")
                    out.append(fence(json.dumps(inp, indent=2), "json") + "\n")
        elif isinstance(content, str) and content.strip():
            out.append(f"## 🤖 Assistant · {ts}\n")
            out.append(content.strip() + "\n")

    return "\n".join(out)


def main():
    if not os.path.isdir(PROJECT_DIR):
        sys.exit(f"No project session dir found at {PROJECT_DIR}")
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(f for f in os.listdir(PROJECT_DIR) if f.endswith(".jsonl"))
    if not files:
        sys.exit("No .jsonl session files found.")
    written = []
    for fname in files:
        sid = fname[:-6]
        records = load(os.path.join(PROJECT_DIR, fname))
        meta = session_meta(records)
        start_dt = meta["start"]
        date_prefix = ""
        if start_dt:
            try:
                date_prefix = datetime.fromisoformat(
                    start_dt.replace("Z", "+00:00")
                ).astimezone(timezone.utc).strftime("%Y%m%d-%H%M") + "-"
            except Exception:
                pass
        slug = slugify(meta["title"] or meta["first_prompt"] or sid)
        out_name = f"{date_prefix}{slug}-{sid[:8]}.md"
        md = render(records, sid)
        with open(os.path.join(OUT_DIR, out_name), "w", encoding="utf-8") as fh:
            fh.write(md)
        written.append((out_name, len(records)))
    print(f"Wrote {len(written)} session log(s) to {OUT_DIR}:")
    for name, n in written:
        print(f"  - {name}  ({n} records)")


if __name__ == "__main__":
    main()
