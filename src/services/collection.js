import http from "./http-module";

const shopify_url =
  "https://app.metafields.guru/api?hmac=8cc0333d0db51e05dd38b82887451ea65d62abfe43c72ed379dcc965e63875c5&locale=en&session=d445af36885a06d7439082cef01d8195daba6b2a929565d5a367ebe747b5f0ea&shop=zay-test.myshopify.com&timestamp=1585833302";
const shopify_body = {
  type: "POST",
  path: "graphql",
  params: {
    query:
      "\n    query collections($first: Int!, $sortKey: CollectionSortKeys!) {\n      collections(first: $first, sortKey: $sortKey) {\n        edges {\n          cursor\n          node {\n            id title handle image { transformedSrc altText }\n            metafields(first: 5) {\n              edges {\n                node {\n                  legacyResourceId\n                }\n              }\n              pageInfo {\n                hasNextPage\n              }\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  ",
    variables: {
      first: 20,
      sortKey: "TITLE"
    }
  }
};

const getCollections = () => {
  return http.post(shopify_url, shopify_body);
};

export default getCollections;
