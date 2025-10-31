import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

interface Feedback {
  params: { product: string };
}

export async function generateMetadata() : Promise<Metadata> {
  return {
    title: `YakShaver Feedback`,
    description: `Leave us some feedback about your YakShaver experience`,
    openGraph: {
      title: `YakShaver Feedback`,
      description: `Leave us some feedback about your YakShaver experience`,
      images: `/default-images/YakShaver-default.png`,
    },
  };
}

export default async function Feedback({ params }: Feedback) {
    if(params.product !== "YakShaver")
        notFound();

  return <>
  <div
        data-form-id='abcf6de1-3cae-f011-bbd3-000d3ad0fcef'
        data-form-api-url='https://public-oce.mkt.dynamics.com/api/v1.0/orgs/21dfd5be-b4a6-4cf1-ab3c-316c54b7089a/landingpageforms'
        data-cached-form-url='https://assets-oce.mkt.dynamics.com/21dfd5be-b4a6-4cf1-ab3c-316c54b7089a/digitalassets/forms/abcf6de1-3cae-f011-bbd3-000d3ad0fcef' >
        </div>
        <Script src='https://cxppusa1formui01cdnsa01-endpoint.azureedge.net/oce/FormLoader/FormLoader.bundle.js' />
        </>
}
