import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GiCheckMark } from 'react-icons/gi';
import { FaArrowDownLong, FaXmark } from 'react-icons/fa6';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const App = () => {

  const [resData, setResData] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(true);
  const [errorData, setErrorData] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  console.log(resData[0]?.status_message);

  const handleSearchBox = (e) => {
    e.preventDefault();
    setShowLoading(true);
    setShowContent(false);
    setShowSearchBox(false);
    const searchURL = e.target.search.value;
    console.log(searchURL);
    const post_array = [];
    post_array.push({
      url: searchURL ,
      enable_javascript: true,
      custom_js: 'meta = {}; meta.url = document.URL; meta;',
    });

    axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/instant_pages',
      auth: {
        username: 'abukawsarweb45@gmail.com',
        password: 'ce12d5e4266dcc8b',
      },
      data: post_array,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(function (response) {
        var results = response['data']['tasks'];
        // Result data
        setShowLoading(false);
        setShowContent(true);
        setResData(results);
        // console.log(results[0].result[0].items[0].checks.title_too_long);
        setShowMessage(results[0]?.status_message);
        console.log(results[0]?.status_message);

        // console.log(showContent);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const {
    duplicate_title,
    duplicate_description,
    duplicate_content,
    cache_control,
    checks,
    meta,
  } = resData[0]?.result[0]?.items[0] || {};
  const {
    internal_links_count,
    images_count,
    images_size,
    scripts_count,
    scripts_size,
    content,
    htags,
    page_timing,
    onpage_score,
  } = meta || {};
  const {
    connection_time,
    dom_complete,
    download_time,
    duration_time,
    fetch_end,
    fetch_start,
    first_input_delay,
    largest_contentful_paint,
    request_sent_time,
    time_to_interactive,
    time_to_secure_connection,
    waiting_time,
  } = page_timing || {};

  const {
    plain_text_size,
    plain_text_rate,
    plain_text_word_count,
    automated_readability_index,
    coleman_liau_readability_index,
    dale_chall_readability_index,
    flesch_kincaid_readability_index,
    smog_readability_index,
    title_to_content_consistency,
  } = content || {};

  // console.log(meta?.htags);

  const percentage = onpage_score || 0;

  // useEffect(()=>{
  //   fetch('/seodata.json').then(res=>res.json()).then(data=>{
  //     setResData(data);
  //     setShowContent(true)
  //     console.log(data, '333');
  //   })
  // },[])

  const HeaderList = ({ data }) => {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-5'>
        {Object.keys(data)?.map((tag) => (
          <div key={tag} className='bg-slate-100 p-2 rounded-md'>
            <p className='text-xl my-2'>{`We found #${
              data[tag]?.length
            } ${tag.toUpperCase()} tags on this page.`}</p>
            <>
              {data[tag]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </>
          </div>
        ))}
      </div>
    );
  };

  const downloadPDF = () => {
    // console.log('object');
    const capture = document.querySelector('#total-report');
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const blogData = canvas.toDataURL('img/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(blogData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save('seo_report.pdf');
    });
  };

  return (
    <div>
      {' '}
      <h4 className='text-black my-8'>{showMessage}</h4>
      <div>
        <div>
          {showSearchBox && (
            <div className='my-8'>
              <form className='text-center' onSubmit={handleSearchBox}>
                <input
                  type='url'
                  name='search'
                  placeholder='Search your URL'
                  required
                  className='  rounded-s-full px-4 md:px-16 py-2 text-black  border-2 border-slate-100 custom-josefin text-center  w-6/12'
                />
                <button
                  type='submit'
                  className='bg-black  text-white rounded-full -ml-8 px-4 md:px-16 py-2 border-2 border-slate-100 hover:border-lime-400 custom-josefin text-center'
                >
                  Get a free SEO Report
                </button>
              </form>
            </div>
          )}
        </div>

        <div>
          {showLoading && (
            <div className='flex justify-center items-center'>
              <ScaleLoader color='#36d7b7' />;
            </div>
          )}
        </div>
        <div>
          {errorData && (
            <h3 className='text-red-500 text-center text-lg my-8'>
              {' '}
              Somethings is wrong. Please try again
            </h3>
          )}
        </div>

        {showContent && (
          <div
            id='total-report'
            className='relative max-w-screen-2xl mx-2 md:mx-4 lg:mx-8 my-2 md:my-4 lg:my-8 max '
          >
            {/* download button */}
            <div className='fixed top-3 right-0 pb-4 md:pb-6 lg:pb-8'>
              <div className=' '>
                <button
                  className='bg-violet-500 px-2 py-1 flex justify-end rounded-lg font-serif text-slate-950 '
                  onClick={downloadPDF}
                  disabled={!(loader === false)}
                >
                  {' '}
                  {loader ? (
                    <span>Downloading</span>
                  ) : (
                    <span>Download PDF</span>
                  )}
                  <FaArrowDownLong className='h-5 w-5 ml-2' />
                </button>
              </div>
            </div>
            <div>
              <div className='text-center my-4'>
                <CircularProgressbar
                  className='h-24'
                  value={percentage}
                  text={`${percentage}%`}
                />
                <h3 className='text-3xl font-bold'>On-page Score</h3>
              </div>
            </div>
            {/* onpage results */}
            <div>
              <h2 className='text-2xl my-3'>Onpage Results</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-5 text-center'>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {internal_links_count || 0}{' '}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Internal Links</h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {' '}
                    {images_count || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Number of Image </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {' '}
                    {images_size || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Images Size </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {scripts_count || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Scripts </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {scripts_size || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Scripts Size </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {plain_text_size || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Plain Text Size </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {plain_text_rate?.toFixed(2) || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Plain Text Size </h4>
                </div>
                <div className='bg-slate-100 p-2 rounded-md'>
                  <h3 className='pt-3 font-medium text-lg'>
                    {plain_text_word_count || 0}
                  </h3>
                  <h4 className='pb-2 font-semibold'>Plain Text Word Count </h4>
                </div>
                {content && (
                  <>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {automated_readability_index.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Automated Readability Index{' '}
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {coleman_liau_readability_index.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Coleman Liau Readability Index{' '}
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {dale_chall_readability_index.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Dale Chall Readability Index{' '}
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {flesch_kincaid_readability_index.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Flesch Kincaid Readability Index{' '}
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {smog_readability_index?.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Smog Readability Index{' '}
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {title_to_content_consistency?.toFixed(2) || 0}
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Title to Content Consistency{' '}
                      </h4>
                    </div>
                  </>
                )}
              </div>

              {/*  */}
              <div className='my-3 md:my-8 lg:my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-5 text-center'>
                {/* duplicate_title */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {duplicate_title ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Duplicate title </h4>
                    <p>
                      {duplicate_title
                        ? 'Having multiple title tags that are identical can harm your websites SEO efforts. It causes confusion for search engines and negatively impacts your ability to rank well for targeted keywords'
                        : 'Duplicate title tags are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'}
                    </p>
                  </div>
                </div>
                {/* duplicate_description */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {duplicate_description ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>
                      Duplicate Description
                    </h4>
                    <p>
                      {duplicate_description
                        ? 'Repeating identical meta descriptions is detrimental to SEO. Such repetition can lead to search engine confusion and increased difficulty in ranking for particular keywords.'
                        : 'Duplicate meta descriptions are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'}
                    </p>
                  </div>
                </div>
                {/* duplicate_content */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {duplicate_content ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Duplicate Content</h4>
                    <p>
                      {duplicate_content
                        ? 'Having duplicate content on your website is detrimental to SEO. It perplexes search engines and exacerbates the challenge of ranking for specific keywords.'
                        : 'Duplicate content is bad for SEO. It confuses search engines and makes it harder to rank for specific keywords.'}
                    </p>
                  </div>
                </div>
                {/* cachable */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {cache_control?.cachable ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Cache Control</h4>
                    <p>
                      {cache_control?.cachable
                        ? 'Your page does not have a cache control header. This can negatively impact your page load speed and user experience.'
                        : 'Implementing a cache control header on your page can significantly enhance your page load speed and improve user experience.'}
                    </p>
                  </div>
                </div>
                {/* canonical */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.canonical ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Canonical</h4>
                    <p>
                      {checks?.canonical
                        ? 'Your page does not have a canonical tag. This can negatively impact your page load speed and user experience.'
                        : 'Adding a canonical tag to your page can help enhance your page load speed and improve user experience.'}
                    </p>
                  </div>
                </div>
                {/* https_to_http_links */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.https_to_http_links ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>HTTPS to HTTP Links</h4>
                    <p>
                      {checks?.https_to_http_links
                        ? 'Having links to HTTP pages on your site can hinder your page load speed and degrade the user experience.'
                        : 'Your page has links to HTTP pages. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* no_h1_tag */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.no_h1_tag ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>No H1 Tag</h4>
                    <p>
                      {checks?.no_h1_tag
                        ? 'Your page does not have an H1 tag. This can negatively impact your page load speed and user experience.'
                        : 'Adding an H1 tag to your page can help improve your page load speed and enhance the user experience.'}
                    </p>
                  </div>
                </div>
                {/*is_4xx_code */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.is_4xx_code ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Is 4xx Code</h4>
                    <p>
                      {checks?.is_4xx_code
                        ? 'Encountering a 4xx status code on your page can slow down the page load speed and result in a poorer user experience.'
                        : 'Your page has a 4xx status code. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/*is_5xx_code */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.is_5xx_code ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Is 5xx Code</h4>
                    <p>
                      {checks?.is_5xx_code
                        ? 'Encountering a 5xx status code on your page can slow down the page load speed and result in a poorer user experience.'
                        : 'Your page has a 5xx status code. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/*is_broken */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.is_broken ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Is Broken</h4>
                    <p>
                      {checks?.is_broken
                        ? 'Having broken links on your page can hinder the page load speed and create a less favorable user experience.'
                        : 'Your page has broken links. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* low_content_rate */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.low_content_rate ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Low Content Rate</h4>
                    <p>
                      {checks?.low_content_rate
                        ? 'Having a low content rate on your page can detract from both page load speed and the overall user experience.'
                        : 'Your page has broken links. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* has_render_blocking_resources */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.has_render_blocking_resources ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>
                      Has Render Blocking Resources
                    </h4>
                    <p>
                      {checks?.has_render_blocking_resources
                        ? 'Your page has render blocking resources. This can negatively impact your page load speed and user experience.'
                        : 'Render-blocking resources on your page can significantly slow down the loading speed and hinder the user experience.'}
                    </p>
                  </div>
                </div>
                {/* low_readability_rate */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.low_readability_rate ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Low Readability Rate</h4>
                    <p>
                      {checks?.low_readability_rate
                        ? 'Your page has a low readability rate. This can negatively impact your page load speed and user experience.'
                        : 'The low readability rate on your page can diminish the user experience and slow down page load speed.'}
                    </p>
                  </div>
                </div>
                {/* title_too_long */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.title_too_long ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Title Too Long</h4>
                    <p>
                      {checks?.title_too_long
                        ? 'Your page has a title that is too long. This can negatively impact your page load speed and user experience.'
                        : 'The excessively long title on your page can have adverse effects on both page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* title_too_short */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.title_too_short ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Title Too Short</h4>
                    <p>
                      {checks?.title_too_short
                        ? 'Your page has a title that is too short. This can negatively impact your page load speed and user experience.'
                        : 'The excessively short title on your page can have adverse effects on both page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* no_image_alt */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.no_image_alt ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>No Image Alt</h4>
                    <p>
                      {checks?.no_image_alt
                        ? 'Your page has images without alt tags. This can negatively impact your page load speed and user experience.'
                        : 'The absence of alt tags on your pages images can have detrimental effects on both page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* no_image_title */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.no_image_title ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>No Image Title</h4>
                    <p>
                      {checks?.no_image_title
                        ? 'Your page has images without title. This can negatively impact your page load speed and user experience.'
                        : 'The absence of title on your pages images can have detrimental effects on both page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* no_favicon */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.no_favicon ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>No Favicon</h4>
                    <p>
                      {checks?.no_favicon
                        ? 'The absence of a favicon on your page may lead to a slower page load speed and a less favorable user experience.'
                        : 'Your page does not have a favicon. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* no_title */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.no_title ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Recursive Canonical</h4>
                    <p>
                      {checks?.no_title
                        ? 'The title tag is an HTML tag that is used to define the title of a webpage. This tag is displayed in the search results and is used by search engines to determine the topic of a page, but it is often overlooked, which can negatively impact SEO.'
                        : 'The title tag is an HTML tag that is used to define the title of a webpage. This tag is displayed in the search results and is used by search engines to determine the topic of a page.'}
                    </p>
                  </div>
                </div>
                {/* large_page_size */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.large_page_size ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>Large Page Size</h4>
                    <p>
                      {checks?.large_page_size
                        ? 'Your page does not have a large page size. This can negatively impact your page load speed and user experience'
                        : 'Your page has large page size. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
                {/* large_page_size */}
                <div className='bg-slate-100 p-2 rounded-md'>
                  <div>
                    {checks?.seo_friendly_url_dynamic_check ? (
                      <>
                        <FaXmark className='text-white bg-red-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    ) : (
                      <>
                        <GiCheckMark className='text-white bg-green-400 text-3xl p-1 rounded-full' />{' '}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className='pb-2 font-semibold'>
                      SEO Friendly URL Dynamic Check
                    </h4>
                    <p>
                      {checks?.seo_friendly_url_dynamic_check
                        ? 'Your page does not have SEO friendly dynamic check. This can negatively impact your page load speed and user experience'
                        : 'Your page has SEO friendly url dynamic check. This can negatively impact your page load speed and user experience.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* h tag */}
            <div>
              <h2 className='text-2xl my-3'>H Tags</h2>
              <div>{meta?.htags && <HeaderList data={htags} />}</div>
            </div>
            {/* speed insights */}
            <div className='mt-5 md:mt-8 lg:mt-10'>
              <h2 className='text-2xl my-2'>Speed Insights</h2>
              <div>
                {page_timing && (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-5 text-center'>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {connection_time || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Time To Secure Connection
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {dom_complete || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Dom Complete</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {download_time || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Download Time</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {duration_time || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Duration Time</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {fetch_end || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Fetch End</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {fetch_start || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Fetch Start</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {first_input_delay || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>First Input Delay</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {largest_contentful_paint || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Largest Contentful Paint
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {request_sent_time || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Request Sent Time</h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {time_to_interactive || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Time to Interactive
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {time_to_secure_connection || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>
                        Time to Secure Connection
                      </h4>
                    </div>
                    <div className='bg-slate-100 p-2 rounded-md'>
                      <h3 className='pt-3 font-medium text-lg'>
                        {waiting_time || 0}ms
                      </h3>
                      <h4 className='pb-2 font-semibold'>Waiting Time</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
