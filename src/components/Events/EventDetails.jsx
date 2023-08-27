import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', params?.id],
    queryFn: ({ signal }) => fetchEvent({ id: params?.id, signal })
  })

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      })
      navigate('/events')
    }
  })

  function handleDelete() {
    mutate({ id: params?.id })
  }

  let content;
  if (isPending) {
    content = <p>Fetching Events Data</p>
  }
  if (isError) {
    content = <ErrorBlock title={"An error occurred"} message={error
      ?.info?.message
    } />
  }
  if (data) {
    content = <div id="event-details-content">
      <img src={`http://localhost:3000/${data?.image}`} alt={data?.image} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data?.location}</p>
          <time dateTime={`${data?.date} ${data?.time}`}>{`${data?.date} ${data?.time}`}</time>
        </div>
        <p id="event-details-description">{data?.description}</p>
      </div>
    </div>
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>EVENT TITLE</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        {content}
      </article>
    </>
  );
}
