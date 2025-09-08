export type FilterType =
    |"eq"
    | "not"
    | "in"
    | "like"
    | "ge"
    | "le"
    | "lt"
    | "btw"
    | "orin"
    | "not_in"
    | "condition"
    | "is_null";

export enum FilterTypeEnum {
    BTW = "btw",
    EQUAL = "eq",
    NOT = "not",
    LIKE = "like",
    GREATER_EQUAL = "ge",
    LESS_THAN = "lt",
    CONDITION = "condition",
}

export interface IParseFilter {
    filterBy: string;
    filterValue: string;
    filterType: FilterType | FilterTypeEnum;
}

export interface IOrderers {
    orderBy: string;
    orderType: "ASC" | "DESC";
}
