import FooterClient from './FooterClient';
import client from '../../tina/__generated__/client';

interface FooterServerProps {
  product: string;
}

export default async function FooterServer({ product }: FooterServerProps) {
  let footerData = null
  try {
    const { data } = await client.queries.footer({
      relativePath: `${product}/${product}-Footer.json`,
    })
    footerData = data
  } catch {
    // We don't care about this... for the moment
  }
  return <FooterClient results={footerData} />;
} 
