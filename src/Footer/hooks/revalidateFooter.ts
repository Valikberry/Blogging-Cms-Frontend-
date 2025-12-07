import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    revalidateTag('global_footer_en', { expire: 0 })
    revalidateTag('global_footer_fr', { expire: 0 })
  }

  return doc
}
