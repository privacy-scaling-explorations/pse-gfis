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
        className="rounded-[6px] mr-[0.5rem] inline border-[2px] border-[#ffffff0F]"
      />
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-bold no-underline text-2xl"
      >
        {repo.name}
      </a>
    </div>
  );
};

export default RepoPreview;
