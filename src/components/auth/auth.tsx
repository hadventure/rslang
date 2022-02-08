import { authUser, createUser } from '@/features/user/user-slice';
import { TWord } from '@/features/words/types';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import cls from './word.module.scss';

// type WordProps = {
//   item: TWord;
// };

export default function Auth() {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onRegisterUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // "name": "string",
    // "email": "string",
    // "password": "string"
    // TODO: via useEffect

    // dispatch(createUser({ name: 'admin', email, password }));
    dispatch(authUser({ email, password }));
    
    setEmail('');
    setPassword('');

    
  };

  return (
    <form onSubmit={onRegisterUser}>
      <input type="text" value={email} onChange={handleEmailInput} />
      <input type="password" value={password} onChange={handlePassInput} />

      <button type="submit">Register</button>
    </form>
  );
}
