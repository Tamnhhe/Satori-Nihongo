import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './flashcard.reducer';

export const Flashcard = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const flashcardList = useAppSelector(state => state.flashcard.entities);
  const loading = useAppSelector(state => state.flashcard.loading);
  const totalItems = useAppSelector(state => state.flashcard.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="flashcard-heading" data-cy="FlashcardHeading">
        <Translate contentKey="onlineSatoriPlatformApp.flashcard.home.title">Flashcards</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="onlineSatoriPlatformApp.flashcard.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/flashcard/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="onlineSatoriPlatformApp.flashcard.home.createLabel">Create new Flashcard</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {flashcardList && flashcardList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('term')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.term">Term</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('term')} />
                </th>
                <th className="hand" onClick={sort('definition')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.definition">Definition</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('definition')} />
                </th>
                <th className="hand" onClick={sort('imageUrl')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.imageUrl">Image Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('imageUrl')} />
                </th>
                <th className="hand" onClick={sort('hint')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.hint">Hint</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hint')} />
                </th>
                <th className="hand" onClick={sort('position')}>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.position">Position</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('position')} />
                </th>
                <th>
                  <Translate contentKey="onlineSatoriPlatformApp.flashcard.lesson">Lesson</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {flashcardList.map((flashcard, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/flashcard/${flashcard.id}`} color="link" size="sm">
                      {flashcard.id}
                    </Button>
                  </td>
                  <td>{flashcard.term}</td>
                  <td>{flashcard.definition}</td>
                  <td>{flashcard.imageUrl}</td>
                  <td>{flashcard.hint}</td>
                  <td>{flashcard.position}</td>
                  <td>{flashcard.lesson ? <Link to={`/lesson/${flashcard.lesson.id}`}>{flashcard.lesson.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/flashcard/${flashcard.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/flashcard/${flashcard.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/flashcard/${flashcard.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.home.notFound">No Flashcards found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={flashcardList && flashcardList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Flashcard;
