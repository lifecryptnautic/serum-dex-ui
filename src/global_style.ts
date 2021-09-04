import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html,body{
  background: #0077b6;
}
input[type=number]::-webkit-inner-spin-button {
  opacity: 0;
}
input[type=number]:hover::-webkit-inner-spin-button,
input[type=number]:focus::-webkit-inner-spin-button {
  opacity: 0.25;
}
/* width */
::-webkit-scrollbar {
  width: 15px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #E00065;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #179AFF;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #F5C800;
}
.ant-slider-track, .ant-slider:hover .ant-slider-track {
  background-color: #F5C800;
  opacity: 0.75;
}
.ant-slider-track,
.ant-slider ant-slider-track:hover {
  background-color: #F5C800;
  opacity: 0.75;
}
.ant-slider-dot-active,
.ant-slider-handle,
.ant-slider-handle-click-focused,
.ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open)  {
  border: 2px solid #F5C800; 
}
.ant-table-tbody > tr.ant-table-row:hover > td {
  background: #000929;
}
.ant-table-tbody > tr > td {
  border-bottom: 8px solid #03045e;
}
.ant-table-container table > thead > tr:first-child th {
  border-bottom: 1px solid #00AACC;
}
.ant-divider-horizontal.ant-divider-with-text::before, .ant-divider-horizontal.ant-divider-with-text::after {
  border-top: 1px solid #179AFF !important;
}
.ant-layout {
    background: #000929
  }
  .ant-table {
    background: #000929;
  }
  .ant-table-thead > tr > th {
    background: #023e8a;
  }
.ant-select-item-option-content {
  img {
    margin-right: 4px;
  }
}
.ant-modal-content {
  background-color: #00005d;
}

@-webkit-keyframes highlight {
  from { background-color: #E000E0;}
  to {background-color: #FF8900;}
}
@-moz-keyframes highlight {
  from { background-color: #E000E0;}
  to {background-color: #FF8900;}
}
@-keyframes highlight {
  from { background-color: #E000E0;}
  to {background-color: #FF8900;}
}
.flash {
  -moz-animation: highlight 0.5s ease 0s 1 alternate ;
  -webkit-animation: highlight 0.5s ease 0s 1 alternate;
  animation: highlight 0.5s ease 0s 1 alternate;
}`;
