import Wrapper from '../component/wrapper';
import { wrapper } from '../redux/store';

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default wrapper.withRedux(MyApp)
