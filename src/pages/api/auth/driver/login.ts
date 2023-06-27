import { setCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  setCookie('token', id, {
    req,
    res,
    path: '/',
    maxAge: 2592000, // 1 mês
  })

  return res.redirect('/driver')
}
