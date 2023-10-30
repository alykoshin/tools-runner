/** @format */

import {ActionDefinition, Actions} from '../lib/types';

import {ErrorLevel} from '../../../lib/log';
import {Plugin, PluginMap, Plugins} from '../../../lib/Plugins';

export type ActivityActionsDefinition = Actions & {
  default: ActionDefinition;
};

export interface Activity extends Plugin {
  base_dir: string;
  version: string;
  logLevel?: ErrorLevel;
  actions: ActivityActionsDefinition;
}

export class Activities extends Plugins<Activity> {
  // async plug(name: string): Promise<Activities> {
  // const current = super.plug(name);
  // return this;
  // }

  actions(): Actions {
    // console.log('Object.keys(this.plugins):', Object.keys(this.plugins));
    //
    // const r = Object.keys(this.plugins).reduce((acc, cur) => {
    //   // console.log(
    //   //   'acc:', acc,
    //   //   'cur:', cur,
    //   //   'this.plugins[cur]:', this.plugins[cur]
    //   // );
    //   return {...acc, ...this.plugins[cur].actions};
    // }, {});
    // console.log('r:', r);
    // return r;
    //
    const mergedActions: Actions = {};
    Object.keys(this.plugins).forEach((pluginName) => {
      const plugin = this.plugins[pluginName];
      Object.keys(plugin.actions).forEach((actionName) => {
        const action = plugin.actions[actionName];
        if (mergedActions[actionName]) {
          console.warn(
            `WARN: Activity "${pluginName}" action name "${actionName}" overrides another action`
          );
        }
        mergedActions[actionName] = action;
      });
    });
    return mergedActions;
  }
}
