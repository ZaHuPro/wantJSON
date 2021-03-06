import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { PageFromStart } from '../components/Layout/Page';
import { postMethod } from '../utils/Integration';
import {
  List, ListContent, FrontIcon, ListTitle, ListAction, URL,
} from '../components/Basic/List';
import { DimText, NotFound } from '../components/Basic/Text';
import { SecondaryBtn } from '../components/Basic/Button/Button';
import {
  InputGroup, Input, Label, InputButton, Item,
} from '../components/Basic/Form';
import {
  SearchForm, Showing, SortGroup, SortItem, SearchListItem,
} from '../components/Extended/Search';

function Explore({ payloadData, pages, searchData }) {
  const [payload, setPayload] = useState(payloadData);
  const [page, setPage] = useState(pages);
  const [search, setSearch] = useState(searchData);
  const [searchInput, setSearchInput] = useState('');
  const [loader, setLoader] = useState(true);

  // if (searchData && searchData.queryBy) {
  //   setSearch(searchData.queryBy);
  // }
  useEffect(() => {
    if (searchData && searchData.queryBy) {
      setSearchInput(searchData.queryBy);
      Router.push(`/explore?keyword=${searchData.queryBy}`, '/explore', { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (searchData && searchData.queryBy) {
      setSearchInput(searchData.queryBy);
      Router.push(`/explore?keyword=${searchData.queryBy}`, '/explore', { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (payload.length === 0 || page.total <= 1) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [page]);

  const loadData = async () => {
    if (page.current < page.total) {
      const newPayload = await postMethod('explore', { page: page.current + 1 });
      setPayload([...payload, ...newPayload.payload]);
      setPage(newPayload.page);
      setSearch(newPayload.search);
      if (newPayload.page.current === newPayload.page.total) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };
  const reQuery = async (searchQuery = search.queryBy,
    sortBy = search.sortBy, orderBy = search.orderBy) => {
    const queryPayload = await postMethod('explore', {
      page: 1, search: searchQuery, sortBy, orderBy,
    });
    setPayload(queryPayload.payload);
    setPage(queryPayload.page);
    setSearch(queryPayload.search);
  };
  const keyPressKeyPush = (e) => {
    if (e.keyCode === 13) {
      reQuery(searchInput);
    }
  };
  const handleSortBy = async (sortBy, orderBy) => {
    await reQuery(search.query, sortBy, orderBy);
  };

  return (
    <PageFromStart>
      <SearchForm>
        <Item>
          <InputGroup>
            <Input
              type="text"
              name="keywords"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => keyPressKeyPush(e)}
              required
            />
            <Label>Search</Label>
            <InputButton tertiary type="button" onClick={() => reQuery(searchInput)}><FontAwesomeIcon icon={faSearch} /></InputButton>
          </InputGroup>
        </Item>
        <Showing>
          Showing 0 –
          {' '}
          {(page.current === page.total) ? page.items : page.current * page.limit}
          {' '}
          of
          {' '}
          {page.items}
          {' '}
          results
          {' '}
          {search.queryBy !== '' && (
          <>
            for &quot;
            <span>
              {search.queryBy}
            </span>
            &quot;
          </>
          )}
        </Showing>
        <SortGroup>
          <span>Sort By</span>
          <SortItem onClick={() => handleSortBy('createdAt', 'DESC')} active={search.sortBy === 'createdAt' && search.orderBy === 'DESC'}>Recent</SortItem>
          <SortItem onClick={() => handleSortBy('viewCount', 'DESC')} active={search.sortBy === 'viewCount' && search.orderBy === 'DESC'}>Viewed</SortItem>
          <SortItem onClick={() => handleSortBy('hitCount', 'DESC')} active={search.sortBy === 'hitCount' && search.orderBy === 'DESC'}>Used</SortItem>
        </SortGroup>
      </SearchForm>
      {payload.length !== 0 && (
      <List>
        {payload.map((p) => (
          <Link key={p.id} href={`/view/${p.url}`}>
            <SearchListItem key={p.id}>
              <FrontIcon active={p.owner.displayName === process.env.APP_NAME}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </FrontIcon>
              <ListContent>
                <ListTitle>{p.title}</ListTitle>
                <DimText>{p.description}</DimText>
                <URL>
                  {process.env.PAYLOAD_URL}
                  {p.url}
                </URL>
              </ListContent>
              <ListAction>
                <DimText>
                  Hit:
                  {' '}
                  {p.hitCount}
                </DimText>
                <DimText>
                  View:
                  {' '}
                  {p.viewCount}
                </DimText>
              </ListAction>
            </SearchListItem>
          </Link>
        ))}
      </List>
      )}
      {loader && <SecondaryBtn margin="0px 0px 28px 0px" onClick={() => loadData()}> Load More </SecondaryBtn>}
      {payload.length === 0 && <NotFound />}
    </PageFromStart>
  );
}

Explore.getInitialProps = async (ctx) => {
  const payloadData = await postMethod('explore', ctx.query && ctx.query.keyword ? { search: ctx.query.keyword } : {});
  if (!payloadData.success && ctx.res) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return null;
  }
  if (!payloadData.success) {
    Router.push('/');
  }
  return {
    payloadData: payloadData.payload,
    pages: payloadData.page,
    searchData: payloadData.search,
  };
};

export default Explore;
