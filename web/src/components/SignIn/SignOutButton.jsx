import React from 'react';
import { Icon } from 'semantic-ui-react';
import { auth } from '../../firebase';

const SignOutButton = () => (
  <Icon name="sign out" link onClick={auth.doSignOut} />
);

export default SignOutButton;
