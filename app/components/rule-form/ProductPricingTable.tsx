import {
  Box,
  IndexTable,
  InlineStack,
  Pagination,
  Text,
  Thumbnail,
  useBreakpoints,
} from "@shopify/polaris";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ProductPricingTableProps } from "../../types/product";


const PRODUCTS_PER_PAGE = 5;

export default function ProductPricingTable({
  products,
  pricingType,
  amount,
  loading = false,
  error = null,
}: ProductPricingTableProps) {
  const { mdDown } =
    useBreakpoints();

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      products.length /
      PRODUCTS_PER_PAGE,
    ),
  );

  const paginatedProducts =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;

      return products.slice(
        startIndex,
        startIndex +
        PRODUCTS_PER_PAGE,
      );
    }, [
      products,
      currentPage,
    ]);

  const numericAmount =
    Number.parseFloat(amount) || 0;

  const getModifiedPrice = (
    originalPrice: number,
  ) => {
    let modifiedPrice = originalPrice;

    switch (pricingType) {
      case "fixedPrice":
        modifiedPrice = numericAmount;
        break;

      case "fixedDiscount":
        modifiedPrice = originalPrice - numericAmount;
        break;

      case "percentage":
        modifiedPrice = originalPrice * (1 - numericAmount / 100);
        break;

      default:
        modifiedPrice = originalPrice;
    }

    modifiedPrice = Math.max(modifiedPrice, 0);
    if (modifiedPrice >= originalPrice) {
      return originalPrice;
    }

    return modifiedPrice;
  };

  if (loading) {
    return (
      <Box padding="400">
        <Text
          as="p"
          tone="subdued"
        >
          Loading products...
        </Text>
      </Box>
    );
  }


  if (error) {
    return (
      <Box padding="400">
        <Text
          as="p"
          tone="critical"
        >
          {error}
        </Text>
      </Box>
    );
  }


  if (products.length === 0) {
    return (
      <Box padding="400">
        <Text
          as="p"
          tone="subdued"
        >
          No products found.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <IndexTable
        condensed={mdDown}
        resourceName={{
          singular: "product",
          plural: "products",
        }}
        itemCount={products.length}
        headings={[
          {
            title: "ID",
          },
          {
            title: "Image",
          },
          {
            title: "Title",
          },
          {
            title: "Original price",
            alignment: "end",
          },
          {
            title: "Modified price",
            alignment: "end",
          },
        ]}
        selectable={false}
      >
        {paginatedProducts.map(
          (
            product,
            index,
          ) => {
            const modifiedPrice =
              getModifiedPrice(
                product.price,
              );

            return (
              <IndexTable.Row
                id={product.id}
                key={product.id}
                position={index}
              >
                {/* ID */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    variant="bodySm"
                    tone="subdued"
                  >
                    {
                      product.id.split(
                        "/",
                      )[4]
                    }
                  </Text>
                </IndexTable.Cell>

                {/* IMAGE */}

                <IndexTable.Cell>
                  <Thumbnail
                    source={
                      product.image ??
                      "https://cdn.shopify.com/s/files/1/0757/9955/files/placeholder-images-image_large.png"
                    }
                    alt={
                      product.imageAlt ||
                      product.title
                    }
                    size="large"
                  />
                </IndexTable.Cell>

                {/* TITLE */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    fontWeight="semibold"
                  >
                    {product.title}
                  </Text>
                </IndexTable.Cell>

                {/* ORIGINAL PRICE */}

                <IndexTable.Cell>
                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    <Text
                      as="span"
                      tone="subdued"
                    >
                      $
                      {product.price.toFixed(
                        2,
                      )}
                    </Text>
                  </div>
                </IndexTable.Cell>

                {/* MODIFIED PRICE */}
                <IndexTable.Cell>
                  <div style={{ textAlign: "right" }}>
                    <Text
                      as="span"
                      tone={
                        modifiedPrice < product.price
                          ? undefined
                          : "subdued"
                      }
                    >
                      ${modifiedPrice.toFixed(2)}
                      {modifiedPrice >= product.price && numericAmount > 0 && (
                        <Text as="span" tone="subdued" variant="bodySm">
                          {" "}(no discount)
                        </Text>
                      )}
                    </Text>
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            );
          },
        )}
      </IndexTable>

      {/* PAGINATION */}

      {products.length >
        PRODUCTS_PER_PAGE && (
          <Box padding="400">
            <InlineStack align="center">
              <Pagination
                hasPrevious={
                  currentPage > 1
                }
                onPrevious={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1,
                      ),
                  )
                }
                hasNext={
                  currentPage <
                  totalPages
                }
                onNext={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1,
                      ),
                  )
                }
                label={`Page ${currentPage} of ${totalPages}`}
              />
            </InlineStack>
          </Box>
        )}
    </>
  );
}