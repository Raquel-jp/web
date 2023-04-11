import React from 'react';

import { Container } from './styles';

function EmptyMessage({message}) {
return <Container>{message}</Container>;
}

export default React.memo(EmptyMessage);