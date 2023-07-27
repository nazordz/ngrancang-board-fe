import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export interface LinkBreadcrumb {
  title: string
  link?: string
}

interface IProps {
  links: LinkBreadcrumb[]
}

const BackofficeBreacrumbs: React.FC<IProps> = (props) => {

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
  }

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {props.links.map((val, index) => (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={val.link}
          >{val.title}</Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default BackofficeBreacrumbs
