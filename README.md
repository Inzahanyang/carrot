document.designMode = "on"

Example : {\_count: {select: {records: {where: {kind: 'Fav'}}}}}

사용하기 위해서는 generator client previewFeatures 배열에 "filteredRelationCount" 를 추가하시면 사용 가능합니다.
