import { IssueStatusEnum } from '@/models';
import { Chip, ChipProps, ChipTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React from 'react'

interface IProps extends ChipProps {
  status: IssueStatusEnum
}

const ChipIssueStatus: React.FC<IProps>  = (props)=> {

  if (props.status == IssueStatusEnum.Todo) {
    return (
      <Chip {...props} />
    )
  } else if (props.status == IssueStatusEnum.InProgress) {
    return (
      <Chip {...props} color="info"/>
    )
  } else if (props.status == IssueStatusEnum.Review) {
    return (
      <Chip {...props} color='warning'/>
    )
  } else if (props.status == IssueStatusEnum.Done) {
    return (
      <Chip {...props} color='success'/>
    )
  }
  return (
    <Chip {...props} />
  )
}

export default ChipIssueStatus;
