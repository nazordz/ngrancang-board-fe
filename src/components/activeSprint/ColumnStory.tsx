import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled'
import { Story } from '@/models';
import { Typography } from '@mui/material';
import ListStory from './ListStory';
const grid = 8;
const borderRadius = 2;

interface IHeader {
  isDragging: boolean
}

interface IProps {
  draggableId: string;
  title: string;
  key: number;
  stories: Story[];
}

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<IHeader>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? "#E3FCEF" : "#EBECF0"};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${"#E3FCEF"};
  }
`;

const ColumnStory: React.FC<IProps> = (props) => {
  return (
    <Draggable
      draggableId={props.draggableId}
      index={props.key}
    >
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Typography>{props.title}</Typography>
          {/* <ListStory  /> */}
        </Container>
      )}
    </Draggable>
  )
}

export default ColumnStory
