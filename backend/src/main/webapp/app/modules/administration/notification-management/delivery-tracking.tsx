import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Translate, translate, TextFormat } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { Input } from 'app/shared/design-system/components/Input/Input';
import { Modal } from 'app/shared/design-system/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getDeliveries, retryFailedDelivery } from './notification-management.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import './delivery-tracking.scss';

const DeliveryTracking = () => {
  const dispatch = useAppDispatch();
  const { id: scheduleId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(20);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);

  const { deliveries, loading, updating, totalItems } = useAppSelector(state => state.notificationManagement);

  useEffect(() => {
    loadDeliveries();
  }, [dispatch, scheduleId, currentPage, sortField, sortOrder, statusFilter, channelFilter]);

  const loadDeliveries = () => {
    const params = {
      scheduleId,
      page: currentPage,
      size: itemsPerPage,
      sort: `${sortField},${sortOrder}`,
    };
    dispatch(getDeliveries(params));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(0);
  };

  const handleRetry = (deliveryId: number) => {
    setSelectedDeliveryId(deliveryId);
    setRetryModalOpen(true);
  };

  const confirmRetry = () => {
    if (selectedDeliveryId) {
      dispatch(retryFailedDelivery(selectedDeliveryId)).then(() => {
        loadDeliveries();
      });
    }
    setRetryModalOpen(false);
    setSelectedDeliveryId(null);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      PENDING: 'status-badge status-badge--pending',
      PROCESSING: 'status-badge status-badge--processing',
      SENT: 'status-badge status-badge--sent',
      DELIVERED: 'status-badge status-badge--delivered',
      FAILED: 'status-badge status-badge--failed',
      CANCELLED: 'status-badge status-badge--cancelled',
      EXPIRED: 'status-badge status-badge--expired',
      SCHEDULED: 'status-badge status-badge--scheduled',
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        <Translate contentKey={`notificationManagement.deliveryStatus.${status.toLowerCase()}`}>{status}</Translate>
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      EMAIL: '📧',
      PUSH: '📱',
      IN_APP: '🔔',
    };
    return icons[channel] || '📨';
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = !statusFilter || delivery.status === statusFilter;
    const matchesChannel = !channelFilter || delivery.deliveryChannel === channelFilter;
    const matchesSearch =
      !searchTerm ||
      delivery.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesChannel && matchesSearch;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="delivery-tracking">
      <div className="delivery-tracking__header">
        <div className="delivery-tracking__breadcrumb">
          <Link to="/admin/notifications">
            <Translate contentKey="notificationManagement.title">Notification Management</Translate>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>
            <Translate contentKey="notificationManagement.deliveryTracking">Delivery Tracking</Translate>
          </span>
        </div>

        <h1>
          <Translate contentKey="notificationManagement.deliveryTracking">Delivery Tracking</Translate>
        </h1>

        {scheduleId && (
          <p className="delivery-tracking__subtitle">
            <Translate contentKey="notificationManagement.deliveryTrackingForSchedule" interpolate={{ id: scheduleId }}>
              Delivery tracking for schedule #{scheduleId}
            </Translate>
          </p>
        )}
      </div>

      <Card>
        <div className="delivery-tracking__filters">
          <div className="filters-row">
            <div className="filter-group">
              <Input
                type="text"
                placeholder={translate('notificationManagement.searchDeliveries')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
                <option value="">
                  <Translate contentKey="notificationManagement.allStatuses">All Statuses</Translate>
                </option>
                <option value="PENDING">
                  <Translate contentKey="notificationManagement.deliveryStatus.pending">Pending</Translate>
                </option>
                <option value="PROCESSING">
                  <Translate contentKey="notificationManagement.deliveryStatus.processing">Processing</Translate>
                </option>
                <option value="SENT">
                  <Translate contentKey="notificationManagement.deliveryStatus.sent">Sent</Translate>
                </option>
                <option value="DELIVERED">
                  <Translate contentKey="notificationManagement.deliveryStatus.delivered">Delivered</Translate>
                </option>
                <option value="FAILED">
                  <Translate contentKey="notificationManagement.deliveryStatus.failed">Failed</Translate>
                </option>
                <option value="EXPIRED">
                  <Translate contentKey="notificationManagement.deliveryStatus.expired">Expired</Translate>
                </option>
              </select>
            </div>

            <div className="filter-group">
              <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="filter-select">
                <option value="">
                  <Translate contentKey="notificationManagement.allChannels">All Channels</Translate>
                </option>
                <option value="EMAIL">
                  <Translate contentKey="notificationManagement.channel.email">Email</Translate>
                </option>
                <option value="PUSH">
                  <Translate contentKey="notificationManagement.channel.push">Push</Translate>
                </option>
                <option value="IN_APP">
                  <Translate contentKey="notificationManagement.channel.inApp">In-App</Translate>
                </option>
              </select>
            </div>

            <Button variant="outline" onClick={loadDeliveries} loading={loading}>
              <Translate contentKey="notificationManagement.refresh">Refresh</Translate>
            </Button>
          </div>
        </div>

        <div className="delivery-tracking__table">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button className="sort-button" onClick={() => handleSort('recipientEmail')}>
                    <Translate contentKey="notificationManagement.delivery.recipient">Recipient</Translate>
                    {sortField === 'recipientEmail' && <span className={`sort-icon ${sortOrder}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th>
                  <button className="sort-button" onClick={() => handleSort('deliveryChannel')}>
                    <Translate contentKey="notificationManagement.delivery.channel">Channel</Translate>
                    {sortField === 'deliveryChannel' && <span className={`sort-icon ${sortOrder}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.delivery.subject">Subject</Translate>
                </th>
                <th>
                  <button className="sort-button" onClick={() => handleSort('status')}>
                    <Translate contentKey="notificationManagement.delivery.status">Status</Translate>
                    {sortField === 'status' && <span className={`sort-icon ${sortOrder}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th>
                  <button className="sort-button" onClick={() => handleSort('createdAt')}>
                    <Translate contentKey="notificationManagement.delivery.createdAt">Created</Translate>
                    {sortField === 'createdAt' && <span className={`sort-icon ${sortOrder}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th>
                  <button className="sort-button" onClick={() => handleSort('sentAt')}>
                    <Translate contentKey="notificationManagement.delivery.sentAt">Sent</Translate>
                    {sortField === 'sentAt' && <span className={`sort-icon ${sortOrder}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.delivery.retries">Retries</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.delivery.actions">Actions</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td>
                    <div className="recipient-info">
                      <div className="recipient-name">{delivery.recipientName || delivery.recipientEmail}</div>
                      {delivery.recipientName && <div className="recipient-email">{delivery.recipientEmail}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="channel-info">
                      <span className="channel-icon">{getChannelIcon(delivery.deliveryChannel)}</span>
                      <span className="channel-name">
                        <Translate contentKey={`notificationManagement.channel.${delivery.deliveryChannel?.toLowerCase()}`}>
                          {delivery.deliveryChannel}
                        </Translate>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="subject-cell" title={delivery.subject}>
                      {delivery.subject}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(delivery.status)}
                    {delivery.failureReason && (
                      <div className="failure-reason" title={delivery.failureReason}>
                        {delivery.failureReason}
                      </div>
                    )}
                  </td>
                  <td>{delivery.createdAt && <TextFormat value={delivery.createdAt} type="date" format={APP_DATE_FORMAT} />}</td>
                  <td>
                    {delivery.sentAt ? (
                      <TextFormat value={delivery.sentAt} type="date" format={APP_DATE_FORMAT} />
                    ) : (
                      <span className="not-sent">-</span>
                    )}
                  </td>
                  <td>
                    <div className="retry-info">
                      <span className="retry-count">
                        {delivery.retryCount || 0} / {delivery.maxRetries || 3}
                      </span>
                      {delivery.nextRetryAt && (
                        <div className="next-retry">
                          <Translate contentKey="notificationManagement.delivery.nextRetry">Next retry</Translate>:
                          <TextFormat value={delivery.nextRetryAt} type="date" format={APP_DATE_FORMAT} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {delivery.canRetry && delivery.status === 'FAILED' && (
                        <Button variant="outline" size="sm" onClick={() => handleRetry(delivery.id)}>
                          <Translate contentKey="notificationManagement.retry">Retry</Translate>
                        </Button>
                      )}
                      {delivery.externalId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real implementation, this would show delivery details
                            alert(`External ID: ${delivery.externalId}`);
                          }}
                        >
                          <Translate contentKey="notificationManagement.details">Details</Translate>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDeliveries.length === 0 && !loading && (
            <div className="delivery-tracking__empty">
              <p>
                <Translate contentKey="notificationManagement.noDeliveries">No delivery records found.</Translate>
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="delivery-tracking__pagination">
            <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
              <Translate contentKey="entity.action.previous">Previous</Translate>
            </Button>

            <span className="pagination-info">
              <Translate
                contentKey="global.item-count"
                interpolate={{
                  first: currentPage * itemsPerPage + 1,
                  last: Math.min((currentPage + 1) * itemsPerPage, totalItems),
                  total: totalItems,
                }}
              >
                Showing {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} items
              </Translate>
            </span>

            <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
              <Translate contentKey="entity.action.next">Next</Translate>
            </Button>
          </div>
        )}
      </Card>

      {/* Retry Confirmation Modal */}
      <Modal isOpen={retryModalOpen} onClose={() => setRetryModalOpen(false)}>
        <div className="modal-header">
          <h2>{translate('notificationManagement.retryDelivery')}</h2>
        </div>
        <p>
          <Translate contentKey="notificationManagement.retryConfirmation">
            Are you sure you want to retry this failed delivery? The notification will be queued for delivery again.
          </Translate>
        </p>
        <div className="modal-actions">
          <Button variant="outline" onClick={() => setRetryModalOpen(false)}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="primary" onClick={confirmRetry} loading={updating}>
            <Translate contentKey="notificationManagement.retry">Retry</Translate>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DeliveryTracking;
