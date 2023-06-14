# encoding: utf-8
"""
Common reusable Parameters classes
----------------------------------
"""

from marshmallow import validate

from flask_marshmallow import base_fields
from marshmallow.validate import OneOf
from flask_restplus_patched import Parameters


class PaginationParameters(Parameters):
    """
    Helper Parameters class to reuse pagination.
    """

    limit = base_fields.Integer(
        description="limit a number of items (allowed range is 1-100), default is 20.",
        missing=20,
        validate=validate.Range(min=1, max=10000)
    )
    offset = base_fields.Integer(
        description="a number of items to skip, default is 0.",
        missing=0,
        validate=validate.Range(min=0)
    )

class SortingParameters(Parameters):
    """
    Helper Parameters class to reuse sorting.
    """

    field = base_fields.String(
        description="field name to sort the query set, default is id.",
        missing="id"
    )
    order = base_fields.String(
        description="order of sorting the data, can be either \"asc\" or \"desc\".",
        validate=OneOf(["asc", "desc"]),
        missing="desc"
    )


class SortPaginateParameters(SortingParameters, PaginationParameters):

    pass

class SortParameters(Parameters):
    """
    Helper Parameters class to reuse sort.
    """
    sort_by = base_fields.String(missing="created")
    sort_asc = base_fields.Boolean(missing=False)