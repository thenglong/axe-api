import { HookFunctionTypes, Extensions } from "../Enums";
import {
  IColumn,
  IModelService,
  IQueryLimitConfig,
  IRelation,
} from "../Interfaces";
import Model from "./../Model";
import { HookFunction, SerializationFunction } from "../Types";

class ModelService implements IModelService {
  name: string;
  instance: Model;
  relations: IRelation[];
  columns: IColumn[];
  columnNames: string[];
  hooks: Record<HookFunctionTypes, HookFunction> = {} as Record<
    HookFunctionTypes,
    HookFunction
  >;
  events: Record<HookFunctionTypes, HookFunction> = {} as Record<
    HookFunctionTypes,
    HookFunction
  >;
  children: IModelService[];
  isRecursive: boolean;
  queryLimits: IQueryLimitConfig[];
  serialize: SerializationFunction | null;

  constructor(name: string, instance: Model) {
    this.name = name;
    this.instance = instance;
    this.relations = [];
    this.columns = [];
    this.columnNames = [];
    this.children = [];
    this.isRecursive = false;
    this.queryLimits = [];
    this.serialize = null;
  }

  setColumns(columns: IColumn[]) {
    this.columns = columns;
    this.columnNames = this.columns.map((i) => i.name);
  }

  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: HookFunction
  ) {
    if (type == Extensions.Hooks) {
      this.setHooks(hookFunctionType, data);
    } else if (type == Extensions.Events) {
      this.setEvents(hookFunctionType, data);
    } else {
      throw new Error("Undefined hook type.");
    }
  }

  setQueryLimits(limits: IQueryLimitConfig[]) {
    this.queryLimits = limits;
  }

  setSerialization(callback: SerializationFunction) {
    this.serialize = callback;
  }

  private setHooks(hookFunctionType: HookFunctionTypes, data: HookFunction) {
    this.hooks[hookFunctionType] = data;
  }

  private setEvents(hookFunctionType: HookFunctionTypes, data: HookFunction) {
    this.events[hookFunctionType] = data;
  }
}

export default ModelService;
