export interface ReactTableProps<D> {
  data: D[];
  columns: {
    Header: string;
    accessor: keyof D;
  }[];
}
