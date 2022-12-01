import useContextMenu from "../customHooks/useContextMenu";

const SideMenu = () => {
  const { anchorPoint, show } = useContextMenu();

  if (show) {
    return (
      <ul
        className="side-menu"
        style={{ top: anchorPoint.y / 1.1, left: anchorPoint.x / 7 }}
      >
        <li>Delete</li>
        <hr />
        <li>Rename</li>
        <hr />
        <li>Continue</li>
      </ul>
    );
  }
  return <></>;
};

export default SideMenu;
