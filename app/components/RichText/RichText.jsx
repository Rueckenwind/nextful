import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

import { H1, H2, H3, UL, OL, LI, P, HR } from '../Typography'
import Link from '../Link'
import { MapStatic } from '../MapStatic'
import { OpeningHours } from '../OpeningHours'
import { ContactForm } from '../ContactForm'
import { BikeTeaser } from '../BikeTeaser'
import getBikeProps from '../../../scripts/remodel/getBikeProps'

const OpenStatus = dynamic(
  () => import('../OpeningHours').then(mod => mod.OpenStatus),
  {
    ssr: false,
  },
)

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => <H1>{children}</H1>,
    [BLOCKS.HEADING_2]: (node, children) => <H2>{children}</H2>,
    [BLOCKS.HEADING_3]: (node, children) => <H3>{children}</H3>,
    [BLOCKS.UL_LIST]: (node, children) => <UL>{children}</UL>,
    [BLOCKS.OL_LIST]: (node, children) => <OL>{children}</OL>,
    [BLOCKS.LIST_ITEM]: (node, children) => <LI>{children}</LI>,
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (!children || (children.length === 1 && children[0] === ''))
        return null
      return <P>{children}</P>
    },
    [BLOCKS.HR]: () => <HR />,
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      const { target } = node.data
      const { id } = target.sys.contentType.sys

      const customComponents = {
        openingStatus: <OpenStatus />,
        openingHours: <OpeningHours />,
        staticMap: <MapStatic />,
        contactForm: <ContactForm />,
      }

      switch (id) {
        case 'sidebarWidget':
        case 'contentKomponente':
          return customComponents[target.fields.id]

        case 'bike':
          // eslint-disable-next-line no-case-declarations
          const bike = getBikeProps(target)
          return <BikeTeaser {...bike} key={bike.id} />

        default:
          return null
      }
    },

    [INLINES.HYPERLINK]: (node, children) => (
      <Link href={node.data.uri}>{children}</Link>
    ),
  },
}

const RichText = ({ content }) => {
  return <div>{documentToReactComponents(content, options)}</div>
}

RichText.propTypes = {
  content: PropTypes.object.isRequired,
}

export default RichText
