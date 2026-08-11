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