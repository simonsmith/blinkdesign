import React from 'react';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/Seo';
import Employment from '../components/Employment';

function getData(data) {
  const edge = data.allYamlYaml.edges.find(e => e.node.cv);
  return edge.node.cv;
}

export default function CvPage({data}) {
  const cv = getData(data);
  return (
    <Layout>
      <SEO title="CV" />
      <article>
        <header>
          <h1>{cv.title}</h1>
          <p>{cv.intro}</p>
        </header>
        <Employment title={cv.employment.title} jobs={cv.employment.items} />
      </article>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    allYamlYaml {
      edges {
        node {
          id
          cv {
            title
            intro
            employment {
              title
              items {
                company
                role
                website
                start_date
                end_date
                notes
              }
            }
            skills {
              title
              items
            }
            projects {
              title
              items
            }
            interests {
              title
              items
            }
          }
        }
      }
    }
  }
`;
