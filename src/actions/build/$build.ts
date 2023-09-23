import {fn_check_params} from "../../lib/util";
import {ActionListDefinition, ActionMethodState, Parameters} from "../../lib/runner";


type BuildActionConfig = {
  cwd: string
  env: { [key: string]: string }
}

export async function $build(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: 1})
  const [pConfig] = parameters;

  const command = `webpack --mode production`;

  const execDefinition: ActionListDefinition = [
    'exec',
    command,
    {
      ...(pConfig as BuildActionConfig),
    },
  ]
  return await runner.eval(execDefinition, state);
}

export default $build;