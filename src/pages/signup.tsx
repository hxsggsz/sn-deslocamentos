import states from '../../states.json'
import { SignUp } from '@/components/auth/client/signup'

export default function Signup() {
  return <SignUp states={states} />
}
