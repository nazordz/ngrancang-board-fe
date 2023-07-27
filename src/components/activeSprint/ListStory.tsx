import React from 'react';
import { StrictModeDroppable } from '../global/StrictModeDroppable';
import { Draggable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Story } from '@/models';
import { Box } from '@mui/material';

interface IProps {
  droppableId: string;
  stories: Story[];
}

// export const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
//   if (isDraggingOver) {
//     return '#FFEBE6';
//   }
//   if (isDraggingFrom) {
//     return '#E6FCFF';
//   }
//   return '#EBECF0';
// };

// const Wrapper = styled.div`
//   background-color: ${(props) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
//   display: flex;
//   flex-direction: column;
//   opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
//   padding: ${grid}px;
//   border: ${grid}px;
//   padding-bottom: 0;
//   transition: background-color 0.2s ease, opacity 0.1s ease;
//   user-select: none;
//   width: 250px;
// `;

const ListStory: React.FC<IProps> = (props) => {
  return (
    <StrictModeDroppable
      droppableId={props.droppableId}
    >
      {(provided, snapshot) => (
        <Box>
          {props.stories.map((st, key) => (
            <Draggable draggableId={st.id} key={st.id} index={key}>
              {(provided, snapshot) => (
                <Box>
                  {st.key}
                </Box>
              )}
            </Draggable>
          ))}
        </Box>
      )}
    </StrictModeDroppable>
  )
}

export default ListStory;
