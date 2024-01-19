interface IssuePreviewProps {
  issue: {
    title: string;
    url: string;
    number: number;
    createdAt: string;
    author: string;
  };
}

const IssuePreview = (props: IssuePreviewProps) => {
  const { issue } = props;

  return (
    <div
      style={{
        display: "flex",
        fontFamily: `-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
      }}
    >
      <svg
        style={{ marginTop: "0.25rem" }}
        fill="rgb(63, 185, 80)"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
      </svg>
      <div style={{ marginLeft: "0.5rem" }}>
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#FFFFFF",
            textDecoration: "none",
          }}
        >
          {issue.title}
        </a>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 400,
            marginTop: "0.25rem",
            color: "#848D97",
          }}
        >
          #{issue.number} opened on {new Date(issue.createdAt).toDateString()}{" "}
          by {issue.author}
        </p>
      </div>
    </div>
  );
};

export default IssuePreview;
