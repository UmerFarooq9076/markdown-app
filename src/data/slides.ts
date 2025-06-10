export const slides = [
  {
    id: "slide-1",
    content: `# Welcome to My Presentation!
This is a stripped-down PowerPoint clone built with **React** and *custom Markdown parsing*.
No external Markdown libraries were used!

- Navigate using the buttons below
- Use the arrow keys (left/right) to move between slides
`,
  },
  {
    id: "slide-2",
    content: `## Understanding Custom Parsing

We're parsing Markdown like:
* Headings (\`#\` to \`######\`)
* Paragraphs (just plain text)
* **Bold text** using \`**double asterisks**\`
* *Italic text* using \`*single asterisks*\`
* \`Inline code\` using \`backticks\`
* Unordered lists using \`-\` or \`*\`
* Ordered lists using \`1.\`, \`2.\`, etc.
`,
  },
  {
    id: "slide-3",
    content: `### How it Works
The core logic involves:
1.  **Block-level parsing**: Identifying headings, lists, and code blocks first.
2.  **Inline-level parsing**: Within each block, identifying and rendering bold, italic, and inline code.

It processes the Markdown line by line and character by character where needed.
`,
  },
];
