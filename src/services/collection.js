import http from "./http-module";

// const shopify_url =
//   "https://app.metafields.guru/api?hmac=8cc0333d0db51e05dd38b82887451ea65d62abfe43c72ed379dcc965e63875c5&locale=en&session=d445af36885a06d7439082cef01d8195daba6b2a929565d5a367ebe747b5f0ea&shop=zay-test.myshopify.com&timestamp=1585833302";

const shopify_url =
  "https://app.metafields.guru/api?hmac=7cfd071f5f881e3fa3c5ca374e1b073b14a000283d20686e68c35825761f39c9&locale=en&session=253cb8b6731ef1126478f392bcae5990e2f6fe757220026a5f17b94ef29b288c&shop=zay-fashions.myshopify.com&timestamp=1586100017";

const sub_collection_url =
  "https://app.metafields.guru/api?hmac=7cfd071f5f881e3fa3c5ca374e1b073b14a000283d20686e68c35825761f39c9&locale=en&session=253cb8b6731ef1126478f392bcae5990e2f6fe757220026a5f17b94ef29b288c&shop=zay-fashions.myshopify.com&timestamp=1586100017";

const shopify_body = {
  type: "POST",
  path: "graphql",
  params: {
    query:
      "\n query collections($first: Int!, $sortKey: CollectionSortKeys!) {\n collections(first: $first, sortKey: $sortKey) {\n edges {\n cursor\n node {\n id title handle image { transformedSrc altText }\n metafields(first: 5) {\n edges {\n node {\n legacyResourceId\n }\n }\n pageInfo {\n hasNextPage\n }\n }\n }\n }\n pageInfo {\n hasNextPage\n hasPreviousPage\n }\n }\n }\n ",
    variables: { first: 20, sortKey: "TITLE" }
  }
};

const shopify_body_sub = {
  type: "GET",
  path: "collections/139167039542/metafields",
  params: { limit: 250 }
};
// const shopify_body = {
//   type: "POST",
//   path: "graphql",
//   params: {
//     query:
//       "\n    query collections($first: Int!, $sortKey: CollectionSortKeys!) {\n      collections(first: $first, sortKey: $sortKey) {\n        edges {\n          cursor\n          node {\n            id title handle image { transformedSrc altText }\n            metafields(first: 5) {\n              edges {\n                node {\n                  legacyResourceId\n                }\n              }\n              pageInfo {\n                hasNextPage\n              }\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  ",
//     variables: {
//       first: 20,
//       sortKey: "TITLE"
//     }
//   }
// };

const getCollections = () => {
  return http.post(shopify_url, shopify_body);
};

const getSubCollections = () => {
  return http.post(sub_collection_url, shopify_body_sub);
};

export default { getCollections, getSubCollections };
