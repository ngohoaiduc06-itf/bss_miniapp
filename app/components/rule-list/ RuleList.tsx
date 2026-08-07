import { mockRules } from "../mock/rules";

export default function RuleList() {
  return (
    <div>
      <h1>Custom Pricing Rules</h1>

      <ul>
        {mockRules.map((rule) => (
          <li key={rule.id}>
            {rule.name} - {rule.status}
          </li>
        ))}
      </ul>
    </div>
  );
}