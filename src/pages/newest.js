import React from 'react';
import {
  graphql,
  gql,
} from 'react-apollo';

import Main from '../layouts/Main';
import NewsFeed from '../components/NewsFeed';
import NewsFeedApolloHOC from '../components/NewsFeedWithApolloRenderer';
import withData from '../helpers/withData';

const POSTS_PER_PAGE = 30;
let pageNumber = 0;

const query = gql`
  query NewestFeed($type: FeedType!, $first: Int!, $skip: Int!) {
    feed(type: $type, first: $first, skip: $skip) {
      ...NewsFeed
    }
  }
  ${NewsFeed.fragments.newsItem}
`;
const variables = {
  type: 'NEW',
  first: POSTS_PER_PAGE,
  skip: POSTS_PER_PAGE * pageNumber,
};

const NewestNewsFeed = graphql(query, {
  options: {
    variables,
  },
  props: ({ data }) => ({
    data,
  }),
})(NewsFeedApolloHOC);

export default withData((props) => {
  pageNumber = (props.url.query && +props.url.query.p) || 0;
  variables.skip = POSTS_PER_PAGE * pageNumber;
  return (
    <Main currentURL={props.url.pathname}>
      <NewestNewsFeed options={{ currentURL: props.url.pathname, first: variables.first, skip: variables.skip }} />
    </Main>
  );
});
