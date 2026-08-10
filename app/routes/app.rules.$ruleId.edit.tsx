// import { useParams } from "react-router";

// import RuleForm from "../components/rule-form/RuleForm";
// import { mockRules } from "../mock/rules";

// export default function EditRulePage() {
//   const { ruleId } = useParams();

//   const rule = mockRules.find(
//     (item) => item.id === ruleId,
//   );

//   return (
//     <RuleForm
//       mode="edit"
//       ruleId={ruleId}
//       rule={rule}
//     />
//   );
// }

import {
  useParams,
} from "react-router";

import RuleForm from "../components/rule-form/RuleForm";

export default function EditRulePage() {
  const { ruleId } =
    useParams();

  return (
    <RuleForm
      mode="edit"
      ruleId={ruleId}
    />
  );
}