import {
  Any,
  Equal,
  ILike,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export const FILTER_MAPPER = {
  more_than: MoreThan,
  less_than: LessThan,
  more_than_or_equal: MoreThanOrEqual,
  less_than_or_equal: LessThanOrEqual,
  equal: Equal,
  not: Not,
  like: Like,
  i_like: ILike,
  any: Any,
};
