interface RepoPreviewProps {
  repo: {
    name: string;
    avatarUrl: string;
    url: string;
  };
}

const RepoPreview = (props: RepoPreviewProps) => {
  const { repo } = props;

  return (
    <div
      style={{
        fontFamily: `-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
        display: "flex",
      }}
    >
      <img
        width={30}
        height={30}
        src={repo.avatarUrl}
        alt="profile"
        style={{
          borderRadius: "6px",
          marginRight: "0.5rem",
          display: "inline",
          border: "2px solid #ffffff0F",
        }}
      />
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
          fontWeight: 600,
          color: "#ffffff",
          textDecoration: "none",
          padding: 0,
        }}
      >
        {repo.name}
      </a>
    </div>
  );
};

export default RepoPreview;
