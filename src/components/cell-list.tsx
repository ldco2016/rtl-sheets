import { useTypedSelector } from "../hooks/use-typed-selector";

const CellList: React.FC = () => {
  useTypedSelector((state) => state);
  return <div>CellList</div>;
};

export default CellList;
