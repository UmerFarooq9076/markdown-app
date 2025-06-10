import React, { useRef, useState, useCallback } from "react";
import "./SlideRenderer.css";

type SlideRendererProps = {
  content: string;
  onChange: (updatedContent: string) => void;
};

export const SlideRenderer = ({ content, onChange }: SlideRendererProps) => {
  const [isEditing, setIsEditing] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyToggleMarkdown = useCallback(
    (syntaxStart: string, syntaxEnd: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      let newContent = content;
      let newSelectionStart = start;
      let newSelectionEnd = end;

      if (selectedText.length > 0) {
        const prefixBeforeSelection = content.substring(
          start - syntaxStart.length,
          start
        );
        const suffixAfterSelection = content.substring(
          end,
          end + syntaxEnd.length
        );

        if (
          prefixBeforeSelection === syntaxStart &&
          suffixAfterSelection === syntaxEnd
        ) {
          newContent =
            content.substring(0, start - syntaxStart.length) +
            selectedText +
            content.substring(end + syntaxEnd.length);
          newSelectionStart = start - syntaxStart.length;
          newSelectionEnd = end - syntaxStart.length;
        } else {
          newContent =
            content.substring(0, start) +
            syntaxStart +
            selectedText +
            syntaxEnd +
            content.substring(end);
          newSelectionStart = start + syntaxStart.length;
          newSelectionEnd = end + syntaxStart.length;
        }
      } else {
        newContent =
          content.substring(0, start) +
          syntaxStart +
          syntaxEnd +
          content.substring(end);
        newSelectionStart = start + syntaxStart.length;
        newSelectionEnd = newSelectionStart;
      }

      onChange(newContent);
      setTimeout(() => {
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
        textarea.focus();
      }, 0);
    },
    [content, onChange]
  );

  // Handler for Bold button
  const onBold = useCallback(
    () => applyToggleMarkdown("**", "**"),
    [applyToggleMarkdown]
  );

  // Handler for Italic button
  const onItalic = useCallback(
    () => applyToggleMarkdown("_", "_"),
    [applyToggleMarkdown]
  );

  // Handler for Heading buttons
  const onHeading = useCallback(
    (level: number) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;

      const lineStart = content.lastIndexOf("\n", cursorPosition - 1) + 1;
      const lineEnd = content.indexOf("\n", cursorPosition);
      const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;

      const currentLineText = content.substring(lineStart, actualLineEnd);
      const beforeLine = content.substring(0, lineStart);
      const afterLine = content.substring(actualLineEnd);

      let newContent = content;
      let newCursorPosition = cursorPosition;

      // Regex to match existing heading: #, ##, etc., followed by a space
      const headingPrefixMatch = currentLineText.match(/^(#{1,6})\s/);

      if (headingPrefixMatch) {
        // Line already has a heading
        const existingHashes = headingPrefixMatch[1];
        const existingLevel = existingHashes.length;
        const textWithoutExistingHeading = currentLineText.substring(
          existingHashes.length + 1
        );

        if (existingLevel === level) {
          newContent = beforeLine + textWithoutExistingHeading + afterLine;
          newCursorPosition = cursorPosition - (existingHashes.length + 1);
        } else {
          const newHashes = "#".repeat(level) + " ";
          newContent =
            beforeLine + newHashes + textWithoutExistingHeading + afterLine;
          newCursorPosition =
            cursorPosition - (existingHashes.length + 1) + newHashes.length;
        }
      } else {
        // No existing heading, add the new heading
        const newHashes = "#".repeat(level) + " ";
        newContent = beforeLine + newHashes + currentLineText + afterLine;
        newCursorPosition = cursorPosition + newHashes.length;
      }

      onChange(newContent);

      setTimeout(() => {
        textarea.setSelectionRange(
          Math.max(lineStart, newCursorPosition),
          Math.max(lineStart, newCursorPosition)
        );
        textarea.focus();
      }, 0);
    },
    [content, onChange]
  );

  const parseInline = (text: string, lineIndex: number) => {
    let parts: any[] = [];
    let lastIndex = 0;

    // Regex to match bold (**text** or __text__), italic (*text* or _text_), and inline code (`text`)
    const regex =
      /(\*\*([^\*]+?)\*\*)|(__([^_]+?)__)|(\*([^\*]+?)\*)|(_([^_]+?)_)|(`([^`]+?)`)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const startIndex = match.index;

      if (startIndex > lastIndex) {
        parts.push(text.substring(lastIndex, startIndex));
      }

      if (match[1]) {
        // **bold**
        parts.push(
          <strong key={`${lineIndex}-${startIndex}-bold1`}>{match[2]}</strong>
        );
      } else if (match[3]) {
        // __bold__
        parts.push(
          <strong key={`${lineIndex}-${startIndex}-bold2`}>{match[4]}</strong>
        );
      } else if (match[5]) {
        // *italic*
        parts.push(
          <em key={`${lineIndex}-${startIndex}-italic1`}>{match[6]}</em>
        );
      } else if (match[7]) {
        // _italic_
        parts.push(
          <em key={`${lineIndex}-${startIndex}-italic2`}>{match[8]}</em>
        );
      } else if (match[9]) {
        // `code`
        parts.push(
          <code key={`${lineIndex}-${startIndex}-code`} className="inline-code">
            {match[10]}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  // Basic markdown parser for view mode (only headings, bold, italic)
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, i) => {
      // Heading detection: #, ##, ###, etc.
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const contentText = headingMatch[2];
        const Tag: any = `h${Math.min(level, 6)}`; // Limit to h6
        return React.createElement(
          Tag,
          { key: i },
          parseInline(contentText, i)
        );
      }

      return <p key={i}>{parseInline(line, i)}</p>;
    });
  };

  const saveContent = () => {
    console.log('saveContent: ');
  }

  return (
    <div className="slide-editor">
      <h2 className="slide-title">Slide Editor</h2>
      <div className="toolbar">
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{ marginBottom: "10px" }}
        >
          {!isEditing ? "View Slide" : "Edit Slide"}
        </button>

        <button
          onClick={() => saveContent()}
          style={{ marginBottom: "10px" }}
        >
          Save
        </button>
      </div>

      {!isEditing ? (
        <>
          <div className="toolbar">
            <button type="button" onClick={onBold}>
              <b>B</b>
            </button>
            <button type="button" onClick={onItalic}>
              <i>I</i>
            </button>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onHeading(level)}
              >
                H{level}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="slide-textarea"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your slide content here..."
          />
        </>
      ) : (
        <div className="slide-viewer">{renderMarkdown(content)}</div>
      )}
    </div>
  );
};
