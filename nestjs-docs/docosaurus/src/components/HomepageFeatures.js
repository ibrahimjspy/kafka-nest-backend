/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Simple and Fast',
    Svg: require('../../static/img/rest.svg').default,
    description: (
      <>
        We use RESTful APIs with efficient response structuring and optimization
        to deliver API responses that are easy to understand and adapt.
      </>
    ),
  },
  {
    title: 'Latest technology',
    Svg: require('../../static/img/nestjs-icon.svg').default,
    description: (
      <>
        We are using Nest.js, a modern and latest framework, to create RESTful
        APIs in Node.js that are maintainable and robust.
      </>
    ),
  },
  {
    title: 'Powered by Node',
    Svg: require('../../static/img/nodejs-icon.svg').default,
    description: (
      <>
        Built on top of fast and lightweight Node.js, it offers high performance
        and efficient load management.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
