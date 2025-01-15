package ProxyService

import (
	"context"
	"log"
	"net"

	pb "github.com/golang/protobuf/proto"
	"google.golang.org/grpc"
)

type ProxyGroup struct {
	PGName string
	PGId   int
	PGList []Proxy
}
type Proxy struct {
	ip  string
	usr string
	psw string
}

type server struct {
	pb.UnimplementedProxyServiceServer
}

func (s *server) GetProxyGroups(ctx context.Context, req *pb.ProxyGroupsRequest) (*pb.ProxyGroupsResponse, error) {
	return &pb.ProxyGroupsResponse{}, nil
}
func ProxyService() {
	lis, err := net.Listen("tcp", ":38450")
	if err != nil {
		log.Panic("Could not start server", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterProxyServiceServer(grpcServer, &server{})
	grpcServer.Serve(lis)
}
