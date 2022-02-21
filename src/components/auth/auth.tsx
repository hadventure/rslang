import { getUser, createUser, UserState } from '@/features/user/user-slice';
import {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import MsgBlock from '../msg-block/msg-block';
import cls from './auth.module.scss';

type AuthProps = {
  user: UserState;
};

// TODO: сделать хук для обработки полей

export default function Auth({ user }: AuthProps) {
  const [signin, setSignin] = useState(true);

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.msg === 'Please sign in') {
      setSignin(!signin);
    }
  }, [user.msg]);

  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onRegisterUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: via useEffect
    if (signin) {
      dispatch(getUser({ email, password }));
    }

    if (!signin) {
      dispatch(createUser({ name, email, password }));
    }

    setEmail('');
    setPassword('');
  };

  const toggleSignin = () => {
    setSignin(!signin);
  };

  return (
    <div className={cls.main}>
      <div className={cls.formContainer}>
        <p className={cls.toggleSigninWrap}>
          {
          !signin
            ? (
              <>
                Already have an account?

                {' '}
                <span className={cls.toggleSignin} onClick={toggleSignin}>Sign In.</span>
                {' '}
                {' '}

              </>
            ) : (
              <>
                New to RS Lang?
                {' '}
                <span className={cls.toggleSignin} onClick={toggleSignin}>Create an account.</span>
                {' '}
              </>
            )
        }

        </p>
        {user.msg !== '' && <MsgBlock text={user.msg} />}

        <br />
        <br />
        <form className={cls.form} onSubmit={onRegisterUser}>
          <div className={cls.inputs}>
            {
              !signin
              && (
              <div className={cls.formItem}>
                <label htmlFor="firstname">Firstname</label>
                <input type="text" name="firstname" id="firstname" onChange={handleNameInput} />
              </div>
              )
            }

            <div className={cls.formItem}>
              <label htmlFor="email">Email</label>
              <input type="email" value={email} onChange={handleEmailInput} name="email" id="email" />
              {/* <small>Error message</small> */}
            </div>

            <div className={cls.formItem}>
              <label htmlFor="lastname">Password</label>
              <input type="password" value={password} onChange={handlePassInput} name="lastname" id="lastname" />
            </div>
          </div>

          <div className={cls.btns}>
            <button type="submit" className={cls.button}>
              {signin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>

    </div>

  );
}
