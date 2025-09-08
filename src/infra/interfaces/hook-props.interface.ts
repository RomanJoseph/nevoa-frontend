import { IOrderers, IParseFilter } from "./parse-filters";

export interface IHookProps {
    page?: number;
    per_page?: number;
    filters: IParseFilter[];
    canExecute?: boolean;
    orderers?: IOrderers;
}
