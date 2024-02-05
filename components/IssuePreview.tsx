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
        className="dark:fill-[#3fba4f] fill-[#197f36] mt-1"
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
          className="font-semibold text-base no-underline"
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {issue.title}
        </a>
        <p className="text-xs font-normal mt-1 dark:text-[#848D97] text-[#646c75]">
          #{issue.number} opened on {new Date(issue.createdAt).toDateString()}{" "}
          by {issue.author}
        </p>
      </div>
    </div>
  );
};

export default IssuePreview;
