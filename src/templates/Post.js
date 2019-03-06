import React from 'react';
import {graphql} from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/Seo';
import Disqus from '../components/Disqus';

export default function PostTemplate({data, location}) {
  const {post, metadata} = data;
  const {frontmatter, html} = post;
  const {
    disqus: {url, script},
  } = metadata.siteMetadata;
  return (
    <Layout>
      <SEO title={frontmatter.title} />
      <div>
        <h1 css={styles.header}>{frontmatter.title}</h1>
        <time css={styles.date}>{frontmatter.date}</time>
        <div css={styles.content} dangerouslySetInnerHTML={{__html: html}} />
        <Disqus path={location.pathname} baseUrl={url} scriptUrl={script} />
      </div>
    </Layout>
  );
}

const styles = {
  header: {
    marginBottom: '.5rem',
  },

  date: {
    fontSize: '0.9rem',
    display: 'block',
  },

  content: {
    marginTop: '2rem',
  },
};

export const pageQuery = graphql`
  query getMarkdown($path: String!) {
    post: markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
    metadata: site {
      siteMetadata {
        disqus {
          url
          script
        }
      }
    }
  }
`;
