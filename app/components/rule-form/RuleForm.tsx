import {
  BlockStack,
  Box,
  Button,
  Card,
  ChoiceList,
  InlineStack,
  Page,
  Select,
  Text,
  TextField,
  useBreakpoints,
} from "@shopify/polaris";


import {
  getProducts,
} from "../../api/productApi";

import type {
  Product,
} from "../../types/product";

import ProductPricingTable from "./ProductPricingTable";

import type {
  ApplyToType,
  PricingType,
} from "../../types/rule";

import {
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";

import { useNavigate } from "react-router";

import type { Rule } from "../../types/rule";

import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks";

import {
  createRule,
  fetchRuleById,
  updateRule,
} from "../../store/slices/rulesSlice";

type RuleFormProps = {
  mode: "create" | "edit";
  ruleId?: string;
};

export default function RuleForm({
  mode,
  ruleId,
}: RuleFormProps) {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const shopData = useAppSelector((state) => state.shopData);

  const { mdDown } =
    useBreakpoints();

  const isEdit =
    mode === "edit";

  const rule = useAppSelector(
    (state) =>
      state.rules.items.find(
        (item) =>
          String(item.id) === String(ruleId),
      ),
  );

  const [name, setName] =
    useState(
      rule?.name ?? "",
    );

  const [status, setStatus] =
    useState<
      "enable" | "disable"
    >(
      rule?.status ??
      "enable",
    );

  const [applyTo, setApplyTo] =
    useState<ApplyToType>(
      rule?.applyTo ??
      "all",
    );

  const [tagInput, setTagInput] = useState("");

  const [tags, setTags] =
    useState<string[]>(
      rule?.tags ?? [],
    );

  const [products, setProducts] = useState<Product[]>([]);

  const [productsLoading, setProductsLoading] = useState(false);

  const [productsError, setProductsError] = useState<string | null>(null);

  const [pricingType, setPricingType,] =
    useState<PricingType>(
      rule?.pricingType ??
      "fixedPrice",
    );

  const [amount, setAmount] =
    useState(
      rule?.value?.toString() ??
      "",
    );

  const [showProductPricingDetails, setShowProductPricingDetails,] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    if (!rule) {
      return;
    }

    setName(rule.name);
    setStatus(rule.status);
    setApplyTo(
      rule.applyTo,
    );
    setTags(
      rule.tags ?? [],
    );
    setPricingType(
      rule.pricingType,
    );
    setAmount(
      rule.value.toString(),
    );
  }, [isEdit, rule]);

  useEffect(() => {
    if (!isEdit || !ruleId) {
      return;
    }

    if (!rule) {
      dispatch(
        fetchRuleById(ruleId),
      );
    }
  }, [
    isEdit,
    ruleId,
    rule,
    dispatch,
  ]);


  useEffect(() => {
    if (!shopData.id) {
      return;
    }

    const shopId = shopData.id;

    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const data = await getProducts(shopId);

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load Shopify products:",
          error,
        );

        setProductsError(
          error instanceof Error
            ? error.message
            : "Failed to load products",
        );
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [shopData.id]);

  const addTag = () => {
    const newTag =
      tagInput.trim();

    if (!newTag) {
      return;
    }

    if (
      tags.includes(newTag)
    ) {
      setTagInput("");
      return;
    }

    setTags(
      (currentTags) => [
        ...currentTags,
        newTag,
      ],
    );

    setTagInput("");
  };

  const removeTag = (
    tagToRemove: string,
  ) => {
    setTags(
      (currentTags) =>
        currentTags.filter(
          (tag) =>
            tag !==
            tagToRemove,
        ),
    );
  };

  const numericAmount =
    Number.parseFloat(
      amount,
    ) || 0;

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (!shopData.id) {
      shopify.toast.show("Shop data not loaded yet. Please try again.", {
        isError: true,
      });

      return;
    }

    setIsSaving(true);

    try {
      /**
       * EDIT
       */
      if (isEdit) {
        if (!rule) {
          shopify.toast.show("Cannot update rule: rule not found.", {
            isError: true,
          });

          return;
        }

        const updatedRule: Rule = {
          ...rule,
          name: trimmedName,
          status,
          applyTo,
          tags,
          pricingType,
          value: numericAmount,
          updatedAt: new Date().toISOString().split("T")[0],
        };

        await dispatch(updateRule(updatedRule)).unwrap();

        navigate("/app");

        return;
      }

      /**
       * CREATE
       */
      await dispatch(
        createRule({
          shopId: shopData.id,
          data: {
            name: trimmedName,
            status,
            priority: 1,
            applyTo,
            tags,
            pricingType,
            value: numericAmount,
          },
        }),
      ).unwrap();

      navigate("/app");
    } catch (error) {
      console.error("Failed to save rule:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to save rule. Please try again.";

      shopify.toast.show(message, { isError: true });
    } finally {
      setIsSaving(false);
    }
  };
  
  const pricingOptions = [
    {
      label:
        "Apply a price to selected products/variants",
      value:
        "fixedPrice",
    },
    {
      label:
        "Decrease a fixed amount off the original price",
      value:
        "fixedDiscount",
    },
    {
      label:
        "Decrease the original price by a percentage (%)",
      value:
        "percentage",
    },
  ];

  if (
    isEdit &&
    !rule
  ) {
    return (
      <Page
        title="Rule not found"
        backAction={{
          content:
            "Configuration",
          onAction: () =>
            navigate(
              "/app",
            ),
        }}
      >
        <Card>
          <BlockStack gap="400">
            <Text
              as="h2"
              variant="headingMd"
            >
              Custom pricing rule
              not found
            </Text>

            <Text
              as="p"
              tone="subdued"
            >
              The rule you're
              trying to edit does
              not exist or has
              already been
              deleted.
            </Text>

            <InlineStack>
              <Button
                variant="primary"
                onClick={() =>
                  navigate(
                    "/app",
                  )
                }
              >
                Back to rules
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      title={
        isEdit
          ? `Edit Custom Pricing Rule "${rule?.name ??
          ruleId ??
          ""
          }"`
          : "Add Custom Pricing Rule"
      }
      backAction={{
        content:
          "Configuration",
        onAction: () =>
          navigate(
            "/app",
          ),
      }}
      primaryAction={{
        content: isEdit
          ? "Save changes"
          : "Save",
        onAction:
          handleSave,
        disabled:
          !name.trim(),
      }}
      secondaryActions={[
        {
          content:
            "Cancel",
          onAction: () =>
            navigate(
              "/app",
            ),
        },
      ]}
    >
      <style>
        {`
          .rule-form-section {
            display: grid;
            grid-template-columns: 190px minmax(0, 1fr);
            column-gap: 32px;
            align-items: start;
          }

          .rule-form-section__label {
            padding-top: 8px;
          }

          .rule-form-section__content {
            min-width: 0;
          }

          .rule-form-product-table {
            overflow-x: auto;
          }

          @media (max-width: 750px) {
            .rule-form-section {
              grid-template-columns: 1fr;
              row-gap: 12px;
            }

            .rule-form-section__label {
              padding-top: 0;
            }
          }
        `}
      </style>

      <BlockStack gap="500">

        <div className="rule-form-section">

          {/* LEFT */}

          <div className="rule-form-section__label">
            <Text
              as="h2"
              variant="headingMd"
            >
              General information
            </Text>
          </div>

          {/* RIGHT */}

          <div className="rule-form-section__content">
            <Card>
              <BlockStack gap="400">

                <TextField
                  label="Name"
                  value={name}
                  onChange={
                    setName
                  }
                  autoComplete="off"
                  requiredIndicator
                  placeholder="Example: Rule for VIP customers"
                  helpText="Enter a name to easily identify this pricing rule."
                />

                <Select
                  label="Status"
                  options={[
                    {
                      label:
                        "Enable",
                      value:
                        "enable",
                    },
                    {
                      label:
                        "Disable",
                      value:
                        "disable",
                    },
                  ]}
                  value={
                    status
                  }
                  onChange={(
                    value,
                  ) =>
                    setStatus(
                      value as
                      | "enable"
                      | "disable",
                    )
                  }
                />

              </BlockStack>
            </Card>
          </div>
        </div>

        <div className="rule-form-section">

          {/* LEFT */}

          <div className="rule-form-section__label">
            <Text
              as="h2"
              variant="headingMd"
            >
              Apply to products
            </Text>
          </div>

          {/* RIGHT */}

          <div className="rule-form-section__content">
            <Card>
              <BlockStack gap="400">

                <ChoiceList
                  title=""
                  choices={[
                    {
                      label:
                        "All products",
                      value:
                        "all",
                      helpText:
                        "This rule will be applied to all products in the store.",
                    },
                    {
                      label:
                        "Product tags",
                      value:
                        "tags",
                      helpText:
                        "Apply this rule to products containing any selected tag.",
                    },
                  ]}
                  selected={[
                    applyTo,
                  ]}
                  onChange={(
                    selected,
                  ) => {
                    setApplyTo(
                      selected[0] as ApplyToType,
                    );
                  }}
                />

                {applyTo ===
                  "tags" && (
                    <BlockStack gap="300">

                      <div
                        onKeyDown={(
                          event: KeyboardEvent<HTMLDivElement>,
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();

                            addTag();
                          }
                        }}
                      >
                        <TextField
                          label="Product tags"
                          value={
                            tagInput
                          }
                          onChange={
                            setTagInput
                          }
                          autoComplete="off"
                          placeholder="Enter product tag and press Enter"
                          connectedRight={
                            <Button
                              onClick={
                                addTag
                              }
                            >
                              Add
                            </Button>
                          }
                        />
                      </div>

                      {tags.length >
                        0 && (
                          <InlineStack gap="200">
                            {tags.map(
                              (
                                tag,
                              ) => (
                                <Button
                                  key={
                                    tag
                                  }
                                  onClick={() =>
                                    removeTag(
                                      tag,
                                    )
                                  }
                                >
                                  {tag}{" "}
                                  ×
                                </Button>
                              ),
                            )}
                          </InlineStack>
                        )}

                      <Text
                        as="p"
                        tone="subdued"
                      >
                        Enter one or
                        more product
                        tags. Products
                        matching these
                        tags will be
                        selected when
                        tag-based pricing
                        is implemented.
                      </Text>

                    </BlockStack>
                  )}

              </BlockStack>
            </Card>
          </div>
        </div>

        <div className="rule-form-section">

          {/* LEFT */}

          <div className="rule-form-section__label">
            <Text
              as="h2"
              variant="headingMd"
            >
              Choose B2B discount type
            </Text>
          </div>

          {/* RIGHT */}

          <div className="rule-form-section__content">
            <Card>
              <BlockStack gap="400">

                <ChoiceList
                  title=""
                  choices={
                    pricingOptions
                  }
                  selected={[
                    pricingType,
                  ]}
                  onChange={(
                    selected,
                  ) => {
                    setPricingType(
                      selected[0] as PricingType,
                    );
                  }}
                />

                <TextField
                  label={
                    pricingType ===
                      "fixedPrice"
                      ? "Price"
                      : pricingType ===
                        "fixedDiscount"
                        ? "Discount amount"
                        : "Discount percentage"
                  }
                  type="number"
                  value={amount}
                  onChange={
                    setAmount
                  }
                  suffix={
                    pricingType ===
                      "percentage"
                      ? "%"
                      : "USD"
                  }
                  min="0"
                  autoComplete="off"
                  helpText={
                    pricingType ===
                      "fixedPrice"
                      ? "Set the final price for the selected products."
                      : pricingType ===
                        "fixedDiscount"
                        ? "This amount will be deducted from the original price."
                        : "This percentage will be deducted from the original price."
                  }
                />

                <Text
                  as="p"
                  tone="subdued"
                >
                  The price will be
                  adjusted based on
                  your Shopify Markets
                  settings.
                </Text>

              </BlockStack>
            </Card>
          </div>
        </div>

        <div className="rule-form-section">

          {/* LEFT */}

          <div className="rule-form-section__label">
            <Text
              as="h2"
              variant="headingMd"
            >
              Apply a price to selected products/variants for All customers.
            </Text>
          </div>

          {/* RIGHT */}

          <div className="rule-form-section__content">

            <Card padding="0">

              <Box padding="400">
                <InlineStack
                  align="space-between"
                  blockAlign="center"
                >
                  <Button
                    onClick={() =>
                      setShowProductPricingDetails(
                        (current) =>
                          !current,
                      )
                    }
                  >
                    {showProductPricingDetails
                      ? "Hide product pricing details"
                      : "Show product pricing details"}
                  </Button>
                </InlineStack>
              </Box>

              {showProductPricingDetails && (
                <div className="rule-form-product-table">
                  <ProductPricingTable
                    products={products}
                    pricingType={pricingType}
                    amount={amount}
                    loading={productsLoading}
                    error={productsError}
                  />
                </div>
              )}

            </Card>
          </div>
        </div>

        <InlineStack
          align="end"
          gap="300"
        >
          <Button
            onClick={() =>
              navigate(
                "/app",
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={
              handleSave
            }
            disabled={
              !name.trim()
            }
          >
            {isEdit
              ? "Save changes"
              : "Save"}
          </Button>
        </InlineStack>

      </BlockStack>
    </Page>
  );
}