package router

import (
	"github.com/gin-gonic/gin"
	"github.com/karmada-io/dashboard/pkg/environment"
)

var (
	router     *gin.Engine
	v1         *gin.RouterGroup
	member     *gin.RouterGroup
	baseMember *gin.RouterGroup
)

func init() {
	if !environment.IsDev() {
		gin.SetMode(gin.ReleaseMode)
	}

	router = gin.Default()
	_ = router.SetTrustedProxies(nil)
	v1 = router.Group("/api/v1")
	member = router.Group("/member/:clustername/api/v1")
	baseMember = router.Group("/member/:clustername/api")
	//member.Use(EnsureMemberClusterMiddleware())

	router.GET("/livez", func(c *gin.Context) {
		c.String(200, "livez")
	})
	router.GET("/readyz", func(c *gin.Context) {
		c.String(200, "readyz")
	})
}

func V1() *gin.RouterGroup {
	return v1
}

func Router() *gin.Engine {
	return router
}

func MemberV1() *gin.RouterGroup {
	return member
}
func BaseMember() *gin.RouterGroup {
	return baseMember
}