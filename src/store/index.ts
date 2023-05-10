import { triggerStoreSetup } from "./index.merge";
import * as state from "./index.state";

export * from "./index.state";

triggerStoreSetup(state);
