import { useMemo } from 'react';
import '../styles/blog-view.css';

export default function TableOfContents({ content }) {
  const headings = useMemo(() => {
    if (!content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.querySelectorAll('h1, h2, h3');
    return Array.from(elements).map((el, index) => ({
      id: `heading-${index}`,
      text: el.textContent,
      level: parseInt(el.tagName.charAt(1)),
    }));
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="toc-container">
      <h3 className="toc-title">Table of Contents</h3>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-level-${heading.level}`}
          >
            <button onClick={() => scrollToHeading(heading.id)}>
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
